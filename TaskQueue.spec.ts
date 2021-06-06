describe("", () => {
    it("", async () => {
        const rejectingPromise = Promise.reject(new Error("Operation failed."));
        const resolvingPromise = new Promise<void>((resolve) => setTimeout(resolve, 100));

        await resolvingPromise;

        try {
            await rejectingPromise;
        } catch {
        }
    });
});
