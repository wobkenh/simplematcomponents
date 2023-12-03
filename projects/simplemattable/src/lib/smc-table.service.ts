import {Injectable} from '@angular/core';
import {TableColumn} from './model/table-column.model';

@Injectable({
    providedIn: 'root'
})
export class SmcTableService<T> {

    constructor() {
    }


    public getDisplayedCols(cols: TableColumn<T, any>[]) {
        return cols.filter(col => col.visible);
    }


    public hasFooter(displayedColumns: TableColumn<T, any>[]) {
        return displayedColumns.some(col => col.footer);
    }

    public getColumnKey(col: TableColumn<T, any>, i: number) {
        return i.toString() + '_' + col.property;
    }

    // only checks for column differences
    public checkForDifferences(oldColumns: TableColumn<any, any>[], columns: TableColumn<any, any>[]): boolean {
        if (oldColumns.length !== columns.length) {
            return true;
        }
        return oldColumns.some((col, i) => {
            for (const key in col) {
                if (col[key] !== columns[i][key]) {
                    return true;
                }
            }
        });
    }

}
