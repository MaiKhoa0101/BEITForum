import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { VoteDto } from './dto/vote.dto';
import { Posts } from './schema/post.schema';
import { HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { get } from 'mongoose';
import { GetPostDto } from './dto/get-post.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('single/:postId')
  @HttpCode(200)
  async getPostId(@Param('postId') postId: string) {
    if (!postId) {
      return {
        message: 'postId is required',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.getPostId(postId);
  }

  @Get('getall')
  async getAllPost() {
    console.log('Đã lấy ra tất cả tin tức');
    return await this.postsService.getAllPost();
  }

  @Post('create')
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageUrls', maxCount: 10 },
      { name: 'videoUrls', maxCount: 10 },
    ]),
  ) // 'images' là tên field form-data
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: {
      imageUrls?: Express.Multer.File[];
      videoUrls?: Express.Multer.File[];
    },
  ) {
    console.log(createPostDto);
    return await this.postsService.createNewPost(createPostDto, files);
  }

  @Post('vote/:postId')
  @HttpCode(200)
  async vote(@Param('postId') postId: string, @Body() voteDto: VoteDto) {
    console.log(voteDto);
    //return this.postsService.votes(postId, voteDto);
  }

  @Post('search')
  @HttpCode(200)
  async getPosts(@Body() getPostDto: GetPostDto) {
    return this.postsService.getPosts(getPostDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'newImageUrls', maxCount: 10 },
      { name: 'newVideoUrls', maxCount: 10 },
    ]),
  ) // 'images' là tên field form-data
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles()
    files: {
      newImageUrls?: Express.Multer.File[];
      newVideoUrls?: Express.Multer.File[];
    },
  ) {
    return this.postsService.updatePost(id, updatePostDto, files);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Post('bookmarks/:postId/:userId')
  @HttpCode(HttpStatus.OK)
  async bookmarkPost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    if (!postId || !userId) {
      return {
        message: 'postId và userId là bắt buộc',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.setBookmark(postId, userId);
  }
  @Get('bookmarks/:userId')
  @HttpCode(HttpStatus.OK)
  async getBookmarks(@Param('userId') userId: string) {
    if (!userId) {
      return {
        message: 'userId là bắt buộc',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return this.postsService.getBookmarks(userId);
  }
  @Patch('hide/:id')
  @HttpCode(HttpStatus.OK)
  hidePost(@Param('id') postId: string) {
    return this.postsService.hide(postId);
  }

  // @Get('admin/update-total-posts')
  // async triggerUpdateTotalPosts() {
  //   return this.postsService.updateAllUserTotalPosts();
  // }
}
