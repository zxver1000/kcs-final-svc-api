import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { LightPostDto, LightPost_ } from './dto/LightPostDto';
import { Outlay, OutLayDeserialization } from './post.Outlay';
import { PostDate, PostDateDeserialization } from './post.PostDate';
import {
  Post,
  PostDocument,
  PostSchema,
  PostSchemaDeserialization,
} from './post.schema';
import { Weather, WeatherDeserialization } from './post.Weather';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PaginateModel<PostDocument>,
    private readonly redisService: RedisManagerService,
  ) {}
  private readonly redisPrefixKey = 'Post';
  async addToPostFromDB(
    Outlay: Outlay,
    Weather: Weather,
    PostDate: PostDate,
    owner: string,
    file_id: string[],
  ): Promise<number> {
    const check = await this.PostModel.find({
      PostDate: PostDate,
      owner: owner,
    });
    //존재하면 409
    for (let i = 0; i < check.length; i++) {
      if (
        check[i].Outlay.memo == Outlay.memo &&
        check[i].Outlay.title == Outlay.title
      ) {
        return HttpStatus.CONFLICT;
      }
    }
    const Post = new this.PostModel(PostSchema);
    Post.Outlay = Outlay;
    Post.Weather = Weather;
    Post.PostDate = PostDate;
    Post.owner = owner;
    if (file_id != undefined) Post.file_id = file_id;
    await Post.save();
    return HttpStatus.CREATED;
  }

  async modifyPostFromDB(
    id: string,
    update_Data: object,
  ): Promise<number | Post> {
    const key = `${this.redisPrefixKey}/${id}`;
    let keys = Object.keys(update_Data);
    let new_Post;
    let post = await this.PostModel.findById(id);
    let update = {};
    if (update_Data['Outlay'] != undefined) {
      post.Outlay = OutLayDeserialization(update_Data['Outlay']);
    }
    if (update_Data['PostDate'] != undefined) {
      post.PostDate = PostDateDeserialization(update_Data['PostDate']);
    }
    if (update_Data['Weather'] != undefined) {
      post.Weather = WeatherDeserialization(update_Data['Weather']);
    }
    if (update_Data['file_id'] != undefined) {
      post.file_id = update_Data['file_id'];
    }
    const redisResult = await this.redisService.setCache(key, post);
    await post.save();

    return post;
  }
  async deletePostFromDB(Post: Post, userid: string): Promise<number> {
    const key = `${this.redisPrefixKey}/${Post.id}`;

    const Post_data = await this.PostModel.findOne({ _id: Post.id });
    if (userid == Post_data.owner) {
      Post_data.delete();
      const redisResult = await this.redisService.deleteCache(key);
    }

    return HttpStatus.OK;
  }

  async getPosts(
    page_num: number,
    userid: string,
  ): Promise<LightPostDto[] | number> {
    //10개단위
    const Post_Datas = await this.PostModel.paginate(
      {},
      {
        sort: { createdAt: -1 }, // 최신 순 정렬
        limit: 10, // 개수 제한
        page: page_num, // 페이지 번호
      },
    );
    if (Post_Datas['docs'].length == 0) return HttpStatus.NO_CONTENT;

    let LightPost_Datas = [];
    for (let i = 0; i < Post_Datas['docs'].length; i++) {
      if (Post_Datas['docs'][i].owner != userid) return HttpStatus.UNAUTHORIZED;

      LightPost_Datas.push(Post_Datas['docs'][i].LightPost);
    }
    return LightPost_Datas;
    //return Post_Datas;
  }

  async getPost(id: string): Promise<number | Post> {
    const key = `${this.redisPrefixKey}/${id}`;
    const redisResult = await this.redisService.getCache(key);

    if (!!redisResult) {
      return redisResult;
    }

    const Post_data = await this.PostModel.findOne({
      _id: id,
    });
    if (Post_data == null || Post_data == undefined) {
      return HttpStatus.NO_CONTENT;
    }
    await this.redisService.setCache(key, Post_data);

    return Post_data;
  }
}
