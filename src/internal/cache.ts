export async function noCache(
    key: string,
    getter: () => Promise<any>,
): Promise<any> {
    return await getter();
}
