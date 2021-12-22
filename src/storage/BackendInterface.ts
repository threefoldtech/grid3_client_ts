/**
 * BackendInterface is the interface for the backend storage.
 * It is used by the storage module to store and retrieve data.
 * Example:
 * ```
 * class BackendExample implements BackendInterface {
 *  // implement the functions [ get, set, remove, list ]
 * }
 */
interface BackendInterface {
    // get a value from the storage
    get(key: string): Promise<string>;

    // set a value in the storage
    set(key: string, value: string): Promise<any>;

    // remove a value from the storage
    remove(key: string): Promise<any>;

    // list all keys in the storage
    list(key: string): Promise<string[]>;
}

export default BackendInterface;
