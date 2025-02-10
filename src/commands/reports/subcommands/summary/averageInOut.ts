import QuickChart from 'quickchart-js';
import { formatToCurrency } from '../../../../common/helpers/transformers.helper';
import { TransactionsRepository } from '../../../../database/repositories/transactions.repository';

interface NextReducer {
  category: { positive: boolean };
  value: number;
}

export async function getAverageInOut(ownerId: number) {
  const transactions = TransactionsRepository.createQueryBuilder('a');

  transactions.select(['a.value', 'b.positive']);
  transactions.leftJoinAndSelect('a.category', 'b', 'a.category = b.id');
  transactions.leftJoinAndSelect('a.account', 'c', 'a.account = c.id');
  transactions.andWhere('b.internal is false');
  transactions.andWhere('a.owner = :owner', {
    owner: ownerId,
  });
  const data = (await transactions.getMany()).reduce(
    (prev, next) => {
      if ((next as unknown as NextReducer).category.positive) {
        return { ...prev, positive: prev.positive + next.value };
      }
      return { ...prev, negative: prev.negative + next.value };
    },
    {
      positive: 0,
      negative: 0,
    },
  );
  console.log({ data, negative: formatToCurrency(data.negative) });
  const positive_negative_chart = new QuickChart();
  positive_negative_chart.setConfig({
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Negative'],
      datasets: [
        {
          data: [data.positive, data.negative],
        },
      ],
    },
    options: {
      plugins: {
        doughnutlabel: {
          labels: [
            {
              text: formatToCurrency(data.positive - data.negative),
              font: { size: 20 },
            },
            { text: 'total' },
          ],
        },
      },
    },
  });

  return {
    title: 'Comparativo Ganhos X Gastos',
    description:
      'Comparativo com base na média de ganhos e gastos dos últimos 6 meses',
    image: {
      url: positive_negative_chart.getUrl(),
    },
  };
}
