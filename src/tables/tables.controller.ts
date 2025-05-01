import {
  Patch,
  Post,
  Body,
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { Table } from './entities/table.entity';
import { UpdateTableDto } from './dto/update-table.dto';
import { ResponseTableDTO } from './dto/response-table.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @ApiOperation({ summary: 'Create new table' })
  @ApiResponse({ status: 201, type: ResponseTableDTO })
  @Post()
  async create(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableService.create(createTableDto);
  }

  @Get()
  async findAll(): Promise<ResponseTableDTO[]> {
    return this.tableService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tableService.findById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    return this.tableService.update(+id, updateTableDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.tableService.delete(+id);
  }
}
