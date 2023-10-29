export class ProtoHelper {
    public static enumKeysAsIntegers( enumObject: any): number[] {
        const numbers = Object.keys(enumObject).filter((item) => {
            return !isNaN(Number(item));
        });
        return numbers.map((n)=> parseInt(n, 10)).filter((n) => n >= 0);
    }
}