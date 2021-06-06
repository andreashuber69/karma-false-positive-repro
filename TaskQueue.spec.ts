describe("", () => {
    it("", async () => {
        const rejectingPromise = Promise.reject(new Error("Operation failed."));
        await new Promise<void>((resolve) => setTimeout(resolve, 100));

        try {
            await rejectingPromise;
        } catch {
        }
    });
});
