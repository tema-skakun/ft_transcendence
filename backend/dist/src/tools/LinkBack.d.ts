export declare class LB<T> {
    maps: Map<any, T>[];
    initalize(numberOfProperties: number): void;
    link(objectsToLinkBack: any[], linkTo: T): void;
    retrieveMap(index: number): Map<any, T>;
}
