import type { ProjectType } from './types';

export class Resource<T> {
  constructor(public data: T | null = null, public message: string | null = null) {}

  static Success = class<T> extends Resource<T> {};
  static Error = class<T> extends Resource<T> {};
  static Loading = class<T> extends Resource<T> {};

  static isSuccess(r: any): r is Resource<any> {
    return r instanceof this.Success;
  }

  static isError(r: any): r is Resource<any> {
    return r instanceof this.Error;
  }

  static isLoading(r: any): r is Resource<any> {
    return r instanceof this.Loading;
  }
}

export function toProjectType(str: string): ProjectType {
  switch (str[0]) {
    case 'm':
      return 'manga';
    case 'n':
      return 'novel';
    case 'c':
    case 'd':
      return 'comic';
    case 'f':
      return 'fiction';
  }

  throw new Error();
}
