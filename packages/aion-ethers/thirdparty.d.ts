declare module "blake2b" {
    class Hasher {
        update(input: Uint8Array): Hasher;
        digest(output: Uint8Array): void;
    }
    function blake2b(length: number): Hasher;
    export default blake2b;
}
