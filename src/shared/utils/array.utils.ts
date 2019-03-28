export abstract class ArrayUtils {
  public static intersect(a: any[], b: any[], fieldName: string): any[] {
    return a.filter(x => b.some(y => x[fieldName] === y[fieldName]));
  }
}
