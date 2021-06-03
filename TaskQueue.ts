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
        const current = this.executeAfterPrevious(executeTask);
        this.previous = current;

        try {
            return await current;
        } finally {
            // The following condition can only be true if no other task has been queued while we've been waiting for
            // current to settle. IOW, current was the last task in the queue and the queue is now empty.
            if (this.previous === current) {
                // Without the following statement, continued use of a TaskQueue object would create a memory leak in
                // the sense that no involved promise would ever be eligible for GC, because the current promise would
                // always reference the previous promise, which in turn would reference the promise before the previous
                // promise and so on. Here, we break that chain when the queue becomes empty.
                this.previous = Promise.resolve();
            }
        }
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
