// https://github.com/andreashuber69/net-worth#--
import { TaskQueue } from "./TaskQueue";

const randomDelay = async () => await new Promise<number>(
    (resolve) => {
        const milliseconds = (Math.random() * 800) + 200;
        setTimeout(() => void resolve(milliseconds), milliseconds);
    },
);

const throwException = async () => await Promise.reject(new Error("Operation failed."));

const precision = -2;

const expectFailure = async (promise: Promise<never>) => {
    try {
        await promise;
        fail("The task unexpectedly succeeded.");
    } catch (e: unknown) {
        if (e instanceof Error) {
            expect(e.message).toEqual("Operation failed.");
        } else {
            fail("Unexpected exception type.");
        }
    }
};

describe(TaskQueue.name, () => {
    describe("queue", () => {
        it("should execute tasks sequentially", async () => {
            const sut = new TaskQueue();
            const start = Date.now();
            const firstPromise = sut.queue(randomDelay);
            const secondPromise = sut.queue(randomDelay);
            const firstDelay = await firstPromise;
            expect(Date.now() - start).toBeCloseTo(firstDelay, precision);

            const thirdPromise = sut.queue(throwException);
            const fourthPromise = sut.queue(randomDelay);
            const secondDelay = await secondPromise;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay, precision);

            await expectFailure(thirdPromise);
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay, precision);

            const fourthDelay = await fourthPromise;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay + fourthDelay, precision);
        });
    });

    describe("idle", () => {
        it("should only complete when all tasks have completed", async () => {
            const sut = new TaskQueue();
            const start = Date.now();
            const firstPromise = sut.queue(randomDelay);
            const secondPromise = sut.queue(randomDelay);
            const thirdPromise = sut.queue(throwException);
            const fourthPromise = sut.queue(randomDelay);
            await sut.idle();
            const actualTotalDelay = Date.now() - start;
            await expectFailure(thirdPromise);
            const totalDelay = await firstPromise + await secondPromise + await fourthPromise;
            // Make sure the previous statement did not further delay, i.e. all tasks have in fact completed.
            expect(Date.now() - start).toBeCloseTo(actualTotalDelay, precision);
            expect(actualTotalDelay).toBeCloseTo(totalDelay, precision);
        });
    });
});
