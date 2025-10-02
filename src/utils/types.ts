type DictVal = string | number | boolean

export type Dict<K extends string = string, V = DictVal> = Record<K, V>
