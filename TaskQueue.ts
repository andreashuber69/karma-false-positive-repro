// https://github.com/andreashuber69/net-worth#--
/** Provides the means to execute tasks strictly sequentially. */
export class TaskQueue {
    /**
     * Queues and executes the supplied task.
     *
     * @description First waits for possibly still queued tasks to complete in the sequence they were queued and then
     * calls `executeTask`, waits for the returned promise to settle and then returns the result.
     * @returns The promise returned by `executeTask`.
     */
    public async queue<T>(executeTask: () => Promise<T>) {
        this.previous = this.executeAfterPrevious(executeTask);
        return await this.previous;
    }

    /** Waits for all currently queued tasks to complete. */
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
