import QuickChart from 'quickchart-js';
import { CategoryEntity } from '../../../../database/entities';
import { TransactionsRepository } from '../../../../database/repositories/transactions.repository';

export async function getCategoryClassificationAverages(ownerId: number) {
  const rawData = await TransactionsRepository.createQueryBuilder('t')
    .select([
      'c.classification AS classification',
      'AVG(t.value) AS average_value',
    ])
    .innerJoin(CategoryEntity, 'c', 't.category = c.id')
    .where('c.positive = false')
    .andWhere('c.owner = :owner', { owner: ownerId })
    .andWhere('c.classification != ""')
    .andWhere('t.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)')
    .groupBy('c.classification')
    .orderBy('average_value', 'DESC')
    .getRawMany();

  // Formatando os dados para QuickChart (Pie Chart)
  const labels = rawData.map((row) => row.classification);
  const data = rawData.map((row) => parseFloat(row.average_value));

  const chart = new QuickChart();
  chart.setConfig({
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: 'Média dos Gastos por Classificação',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Cores para cada categoria
        },
      ],
    },
  });
  return {
    title: 'Média dos Gastos por Classificação',
    description: 'Média dos Gastos por Classificação de categorias',
    image: {
      url: chart.getUrl(),
    },
  };
}
