export const compress = async (
    str: string,
    encoding: CompressionFormat = 'gzip'
): Promise<ArrayBuffer> => {
    // Convert the string into a Uint8Array
    const byteArray = new TextEncoder().encode(str);

    // Create a new CompressionStream instance
    const cs = new CompressionStream(encoding);

    // Use a writer to write the data to the stream's writable side
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();

    // Read the compressed data from the readable side into an ArrayBuffer
    return new Response(cs.readable).arrayBuffer();
};

export const decompress = async (
    byteArray: ArrayBuffer,
    encoding: CompressionFormat = 'gzip'
): Promise<string> => {
    // Create a new DecompressionStream instance
    const ds = new DecompressionStream(encoding);

    // Use a writer to write the compressed data
    const writer = ds.writable.getWriter();
    writer.write(byteArray);
    writer.close();

    // Read the decompressed data and decode it back to a string
    const decompressedResponse = new Response(ds.readable);
    const decompressedBlob = await decompressedResponse.blob();
    return decompressedBlob.text();
};

