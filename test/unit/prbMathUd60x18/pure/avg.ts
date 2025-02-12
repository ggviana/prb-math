import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import forEach from "mocha-each";

import { MAX_UD60x18, MAX_WHOLE_UD60x18, ZERO } from "../../../../helpers/constants";
import { bn, fp } from "../../../../helpers/numbers";

export default function shouldBehaveLikeAvg(): void {
  context("when both operands are zero", function () {
    it("retrieves zero", async function () {
      const result: BigNumber = await this.contracts.prbMathUD60x18.doAvg(ZERO, ZERO);
      expect(ZERO).to.equal(result);
    });
  });

  context("when one operand is zero and the other is not zero", function () {
    const testSets = [
      [ZERO, fp(4), fp(2)],
      [fp(4), ZERO, fp(2)],
    ];

    forEach(testSets).it(
      "takes %e and %e and returns %e",
      async function (x: BigNumber, y: BigNumber, expected: BigNumber) {
        const result: BigNumber = await this.contracts.prbMathUD60x18.doAvg(x, y);
        expect(expected).to.equal(result);
      },
    );
  });

  context("when both operands are positive", function () {
    context("when both operands are odd", function () {
      const testSets = [
        [fp(0.000000000000000001), fp(0.000000000000000003), fp(0.000000000000000002)],
        [fp(1), fp(1), fp(1)],
        [fp(3), fp(7), fp(5)],
        [fp(99), fp(199), fp(149)],
        [bn(1e36).add(1), bn(1e37).add(1), bn(5.5e36).add(1)],
        [MAX_UD60x18, MAX_UD60x18, MAX_UD60x18],
      ];

      forEach(testSets).it(
        "takes %e and %e and returns %e",
        async function (x: BigNumber, y: BigNumber, expected: BigNumber) {
          const result: BigNumber = await this.contracts.prbMathUD60x18.doAvg(x, y);
          expect(expected).to.equal(result);
        },
      );
    });

    context("when both operands are even", function () {
      const testSets = [
        [fp(0.000000000000000002), fp(0.000000000000000004), fp(0.000000000000000003)],
        [fp(2), fp(2), fp(2)],
        [fp(4), fp(8), fp(6)],
        [fp(100), fp(200), fp(150)],
        [bn(1e36), bn(1e37), bn(5.5e36)],
      ];

      forEach(testSets).it(
        "takes %e and %e and returns %e",
        async function (x: BigNumber, y: BigNumber, expected: BigNumber) {
          const result: BigNumber = await this.contracts.prbMathUD60x18.doAvg(x, y);
          expect(expected).to.equal(result);
        },
      );
    });

    context("when one operand is even and the other is odd", function () {
      const testSets = [
        [fp(0.000000000000000001), fp(0.000000000000000002), fp(0.000000000000000001)],
        [fp(1), fp(2), fp(1.5)],
        [fp(3), fp(8), fp(5.5)],
        [fp(99), fp(200), fp(149.5)],
        [bn(1e36), bn(1e37).add(1), bn(5.5e36)],
        [MAX_WHOLE_UD60x18, MAX_UD60x18, MAX_UD60x18.add(MAX_WHOLE_UD60x18).div(2)],
      ];

      forEach(testSets).it(
        "takes %e and %e and returns %e",
        async function (x: BigNumber, y: BigNumber, expected: BigNumber) {
          const result: BigNumber = await this.contracts.prbMathUD60x18.doAvg(x, y);
          expect(expected).to.equal(result);
        },
      );
    });
  });
}
