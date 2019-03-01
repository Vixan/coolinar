import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '@nestjs/passport';
import { Recipe } from './recipes.entity';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<any[]> {
    return this.recipesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async add(@Body() recipe: any): Promise<any> {
    const newRecipe = new Recipe({ ...recipe });

    this.recipesService.add(newRecipe);
  }
}
