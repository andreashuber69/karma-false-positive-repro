// https://github.com/andreashuber69/net-worth#--
import { TaskQueue } from "./TaskQueue";

const delay = async () => await new Promise<void>((resolve) => setTimeout(resolve, 100));

const throwException = async () => await Promise.reject(new Error("Operation failed."));

describe(TaskQueue.name, () => {
    describe("idle", () => {
        it("should only complete when all tasks have completed", async () => {
            const sut = new TaskQueue();
            const rejectingPromise = sut.queue(throwException);
            const resolvingPromise = sut.queue(delay);
            await sut.idle();

            try {
                await rejectingPromise;
                fail("The task unexpectedly succeeded.");
            } catch (e: unknown) {
                if (e instanceof Error) {
                    expect(e.message).toEqual("Operation failed.");
                } else {
                    fail("Unexpected exception type.");
                }
            }

            await resolvingPromise;
        });
    });
});
