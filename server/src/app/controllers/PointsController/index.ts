import { Request, Response } from 'express';

import knex from '../../../database/connection';

class PointsController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    const { city, uf, items } = request.query;
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    const { id } = request.params;
    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response
        .status(400)
        .json({ error: 'Point id doent belong to any point' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const [point_id] = await trx('points').insert(point);

    const pointItems = items.map((item_id: number) => ({ item_id, point_id }));
    await trx('point_items').insert(pointItems);

    await trx.commit();
    return response.json({ id: point_id, ...point, items });
  }

  async update(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ update: true });
  }

  async delete(request: Request, response: Response): Promise<Response<any>> {
    return response.json({ delete: true });
  }
}
export default new PointsController();
