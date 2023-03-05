import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortList',
})
export class SortListPipe implements PipeTransform {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public transform(value: any[], property: string): any[] {
    if (!value || !property) {
      return value;
    }

    return value.sort((a, b) => a[property].localeCompare(b[property]));
  }
}
