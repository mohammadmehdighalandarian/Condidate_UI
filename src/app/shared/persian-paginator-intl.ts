import { MatPaginatorIntl } from '@angular/material/paginator';

const persianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 از ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} از ${length}`;
}


export function getPersianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'تعداد :';
  paginatorIntl.nextPageLabel = 'صفحه بعدی';
  paginatorIntl.firstPageLabel = 'اولین صفحه';
  paginatorIntl.previousPageLabel = 'صفحه قبلی';
  paginatorIntl.lastPageLabel = 'آخرین صفحه';
  paginatorIntl.getRangeLabel = persianRangeLabel;
  
  return paginatorIntl;
}