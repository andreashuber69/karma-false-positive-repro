class TaskQueue {
    public async queue<T>(createNext: () => Promise<T>) {
        this.current = this.executeAfterCurrent(createNext);
        return await this.current;
    }

    public async idle() {
        try {
            await this.current;
        // eslint-disable-next-line no-empty
        } catch {
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private current: Promise<unknown> = Promise.resolve();

    private async executeAfterCurrent<T>(createNext: () => Promise<T>) {
        await this.idle();

        return await createNext();
    }
}

describe("", () => {
    it("", async () => {
        const sut = new TaskQueue();
        const rejectingPromise = sut.queue(() => Promise.reject(new Error("Operation failed.")));
        const resolvingPromise = sut.queue(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));
        await sut.idle();

        try {
            await rejectingPromise;
        } catch {
        }

        await resolvingPromise;
    });
});
