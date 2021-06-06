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

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 100));

const throwException = () => Promise.reject(new Error("Operation failed."));

describe("", () => {
    it("", async () => {
        const sut = new TaskQueue();
        const rejectingPromise = sut.queue(throwException);
        const resolvingPromise = sut.queue(delay);
        await sut.idle();

        try {
            await rejectingPromise;
        } catch {
        }

        await resolvingPromise;
    });
});
