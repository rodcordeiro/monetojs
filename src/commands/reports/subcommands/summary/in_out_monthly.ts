import { TransactionsRepository } from '../../../../database/repositories/transactions.repository';
import { CategoryEntity } from '../../../../database/entities';
import QuickChart from 'quickchart-js';

export async function getInOutMonthlyEmbed(ownerId: number) {
  const rawData = await TransactionsRepository.createQueryBuilder('a')
    .select([
      "DATE_FORMAT(a.date, '%Y-%m') AS mes",
      'SUM(CASE WHEN b.positive = true AND b.internal = false THEN a.value ELSE 0 END) AS entradas',
      'SUM(CASE WHEN b.positive = false AND b.internal = false THEN a.value ELSE 0 END) AS saidas',
    ])
    .innerJoin(CategoryEntity, 'b', 'a.category = b.id')
    .where('a.owner = :owner', { owner: ownerId })
    .andWhere('b.internal = false')
    .andWhere('b.transferOrigin = false')
    .andWhere('b.transferDestination = false')
    .groupBy("DATE_FORMAT(a.date, '%Y-%m')")
    .orderBy("DATE_FORMAT(a.date, '%Y-%m')", 'ASC')
    .limit(6)
    .getRawMany();

  // Estruturando os dados para o gráfico
  const labels = rawData.map((row) => row.mes);
  const entradasData = rawData.map((row) => parseFloat(row.entradas));
  const saidasData = rawData.map((row) => parseFloat(row.saidas));

  const chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: entradasData,
          fill: false,
          borderColor: '#853ACD',
        },
        {
          label: 'Saídas',
          data: saidasData,
          fill: false,
          borderColor: '#B488C9',
        },
      ],
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'end',
        anchor: 'end',
        backgroundColor: '#eee',
        borderColor: '#ddd',
        borderRadius: 6,
        borderWidth: 1,
        padding: 4,
        color: '#666666',
        font: {
          family: 'sans-serif',
          size: 10,
          style: 'normal',
        },
      },
    },
  });
  return {
    title: 'Ganhos X Gastos por mês',
    description: 'Comparativo dos ganhos e gastos por mês dos últimos 6 meses',
    image: {
      url: chart.getUrl(),
    },
  };
}
