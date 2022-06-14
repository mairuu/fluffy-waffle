import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ChapterInfo } from '~/domain/models';

export const ITEM_PER_PAGE = 10;

export enum Order {
  ASC,
  DESC,
}

export const useChapterListPresentator = ({
  chapters,
}: {
  chapters?: ChapterInfo[] | null;
}) => {
  const [order, setOrder] = useState(Order.DESC);

  const route = useRouter();
  const { page } = route.query;

  const length = chapters?.length || 0;
  const totals = Math.ceil(length / ITEM_PER_PAGE);
  const activePage = Math.min(Math.max(parsePage(page), 1), totals) || 1;

  const setPage = (page: number) => {
    route.query.page = page.toString();
    route.replace(route, undefined, { shallow: true });
  };

  const toggleOrder = () => {
    setOrder((curr) => (curr === Order.ASC ? Order.DESC : Order.ASC));
    setPage(totals - activePage + 1);
  };

  return { length, totals, activePage, order, setPage, toggleOrder };
};

function parsePage(page: string | string[] | undefined): number {
  if (!page) return 1;
  if (typeof page === 'string') return parseInt(page);
  return parseInt(page[0]);
}
