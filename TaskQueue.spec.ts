// https://github.com/andreashuber69/net-worth#--
import { TaskQueue } from "./TaskQueue";

const randomDelay = async () => await new Promise<number>(
    (resolve) => {
        const milliseconds = (Math.random() * 800) + 200;
        setTimeout(() => void resolve(milliseconds), milliseconds);
    },
);

const throwException = async () => await Promise.reject(new Error("Operation failed."));

describe(TaskQueue.name, () => {
    describe("idle", () => {
        it("should only complete when all tasks have completed", async () => {
            const sut = new TaskQueue();
            const rejectingPromise = sut.queue(throwException);
            const resolvingPromise = sut.queue(randomDelay);
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

            console.log(await resolvingPromise);
        });
    });
});
