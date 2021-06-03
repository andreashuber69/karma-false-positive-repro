class TaskQueue {
    public async queue<T>(createTask: () => Promise<T>) {
        this.previous = this.executeAfterPrevious(createTask);
        return await this.previous;
    }

    public async idle(): Promise<void> {
        try {
            await this.previous;
        // eslint-disable-next-line no-empty
        } catch {
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private previous: Promise<unknown> = Promise.resolve();

    private async executeAfterPrevious<T>(createTask: () => Promise<T>) {
        await this.idle();

        return await createTask();
    }
}

const delay = async () => await new Promise<void>((resolve) => setTimeout(resolve, 100));

const throwException = async () => await Promise.reject(new Error("Operation failed."));

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
