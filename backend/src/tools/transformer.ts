import { instanceToPlain, plainToInstance } from "class-transformer";
import { ClassConstructor } from "class-transformer";

export function entityToTransformedArr<T>(obj: Object [], target: ClassConstructor<T>): T[] {
	const plain: Record<string, any> [] = [];
	for (const elem of obj)
	{
		plain.push(instanceToPlain(elem));
	}
	const ret: T[] = [];
	for (const elem of plain) {
		ret.push(plainToInstance(target, elem, {excludeExtraneousValues: true}))
	}
	return (ret);
}

export function entityToTransformed<T>(obj: Object, target: ClassConstructor<T>): T {
	const plain: Record<string, any> = instanceToPlain(obj);
	return (plainToInstance(target, plain, {excludeExtraneousValues: true}));
}
