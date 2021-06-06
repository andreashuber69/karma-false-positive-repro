class TaskQueue {
    public async queue<T>(createNext: () => Promise<T>) {
        this.current = this.executeAfterCurrent(createNext);
        return await this.current;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private current: Promise<unknown> = Promise.resolve();

    private async executeAfterCurrent<T>(createNext: () => Promise<T>) {
        try {
            await this.current;
        } catch {
        }

        return await createNext();
    }
}

describe("", () => {
    it("", async () => {
        const sut = new TaskQueue();
        const rejectingPromise = sut.queue(() => Promise.reject(new Error("Operation failed.")));
        const resolvingPromise = sut.queue(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));

        await resolvingPromise;

        try {
            await rejectingPromise;
        } catch {
        }
    });
});
