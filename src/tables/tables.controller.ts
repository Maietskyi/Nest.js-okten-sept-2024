import { Post, Body, Controller } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { Table } from './entities/table.entity';

@Controller('tables')
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @Post()
  async create(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableService.create(createTableDto);
  }
}
