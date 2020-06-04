import { Request, Response } from 'express';
import knex from '../../../database/connection';

class ItemController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    const items = await knex('items').select('*');
    const serializedItems = items.map((item) => ({
      ...item,
      url: `http://192.168.0.195:3333/assets/${item.image}`,
    }));
    return response.json(serializedItems);
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ show: true });
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ store: true });
  }

  async update(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ update: true });
  }

  async delete(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ delete: true });
  }
}
export default new ItemController();
