import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisManagerService } from 'src/redis-manager/redis-manager.service';
import { deserializeOutlay, Outlay } from './modules/post.outlay';
import { deserializePostDate, PostDate } from './modules/post.postdate';
import { Post, PostReadOnlyLight, PostSchema } from './post.schema';
import { deserializePostWeather, Weather } from './modules/post.weather';
import { Model, PaginateModel } from 'mongoose';
import { deserializePostText, PostText } from './modules/post.text';
import { deserializeLocation, Location } from './modules/post.location';

export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<Post>,
    private readonly redisService: RedisManagerService,
  ) {}
  private readonly redisPrefixKey = 'Post';

  async addToPostFromDB(
    Outlay: Outlay,
    Weather: Weather,
    PostDate: PostDate,
    PostText: PostText[],
    Location: Location,
    title: string,
    owner: string,
  ): Promise<Post | number> {
    const check = await this.postModel.find({
      PostDate: PostDate,
      owner: owner,
      title,
    });

    //존재하면 409
    for (let i = 0; i < check.length; i++) {
      if (
        check[i].outlay['memo'] == Outlay['memo'] &&
        check[i].outlay['title'] == Outlay['title']
      ) {
        return HttpStatus.CONFLICT;
      }
    }
    const Post = new this.postModel(PostSchema);
    Post.outlay = Outlay;
    Post.Weather = Weather;
    Post.log = PostText;
    Post.location = Location;
    Post.title = title;
    Post.dates = PostDate;
    Post.owner = owner;
    await Post.save();
    return Post;
  }

  async modifyPostFromDB(
    id: string,
    update_Data: object,
  ): Promise<number | Post> {
    const key = `${this.redisPrefixKey}/${id}`;
    let post = await this.postModel.findById(id);

    if (update_Data == undefined) return HttpStatus.NO_CONTENT;

    if (update_Data['outlay'] != undefined) {
      post.outlay = deserializeOutlay(update_Data['outlay']);
    }
    if (update_Data['PostDate'] != undefined) {
      post.dates = deserializePostDate(update_Data['PostDate']);
    }
    if (update_Data['Weather'] != undefined) {
      post.Weather = deserializePostWeather(update_Data['Weather']);
    }
    if (update_Data['log'] != undefined) {
      let updateLog = [];
      for (let i = 0; i < update_Data['log'].length; i++) {
        updateLog.push(deserializePostText(update_Data['log']));
      }
      post.log = updateLog;
    }

    if (update_Data['location'] != undefined) {
      post.location = deserializeLocation(update_Data['location']);
    }
    if (update_Data['title'] != undefined) {
      post.title = update_Data['title'];
    }

    const redisResult = await this.redisService.setCache(key, post);
    await post.save();

    return post;
  }
  async deletePostFromDB(Post: Post, userid: string): Promise<number> {
    const key = `${this.redisPrefixKey}/${Post.id}`;

    const Post_data = await this.postModel.findOne({ _id: Post.id });
    if (userid == Post_data.owner) {
      Post_data.delete();
      const redisResult = await this.redisService.deleteCache(key);
    }

    return HttpStatus.OK;
  }

  async getPosts(page_num: number, userid: string): Promise<Post[] | number> {
    const Post_Datas = await this.postModel.paginate(
      { owner: userid },
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

      LightPost_Datas.push(Post_Datas['docs'][i].lightReadOnlyData);
    }
    return LightPost_Datas;
  }

  async getPost(id: string, userid: string): Promise<Post | number> {
    const key = `${this.redisPrefixKey}/${id}`;
    const redisResult = await this.redisService.getCache(key);

    if (!!redisResult) {
      return redisResult;
    }

    const Post_data = await this.postModel.findOne({
      _id: id,
    });
    if (Post_data == null || Post_data == undefined)
      return HttpStatus.NO_CONTENT;

    if (Post_data.owner != userid) return HttpStatus.UNAUTHORIZED;

    await this.redisService.setCache(key, Post_data);

    return Post_data;
  }
}
