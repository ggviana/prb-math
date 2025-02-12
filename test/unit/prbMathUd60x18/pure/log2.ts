import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import forEach from "mocha-each";

import { E, LOG2_MAX_UD60x18, MAX_UD60x18, MAX_WHOLE_UD60x18, PI, SCALE, ZERO } from "../../../../helpers/constants";
import { bn, fp, fpPowOfTwo } from "../../../../helpers/numbers";

export default function shouldBehaveLikeLog2(): void {
  context("when x is less than 1e18", function () {
    const testSets = [ZERO, fp(0.0625), fp(0.1), fp(0.5), fp(0.8), SCALE.sub(1)];

    forEach(testSets).it("takes %e and reverts", async function () {
      const x: BigNumber = ZERO;
      await expect(this.contracts.prbMathUD60x18.doLog2(x)).to.be.reverted;
    });
  });

  context("when x is greater than or equal to 1e18", function () {
    context("when x is a power of two", function () {
      const testSets = [
        [fp(1), ZERO],
        [fp(2), fp(1)],
        [fp(4), fp(2)],
        [fp(8), fp(3)],
        [fp(16), fp(4)],
        [fpPowOfTwo(195), fp(195)],
      ];

      forEach(testSets).it("takes %e and returns %e", async function (x: BigNumber, expected: BigNumber) {
        const result: BigNumber = await this.contracts.prbMathUD60x18.doLog2(x);
        expect(expected).to.equal(result);
      });
    });

    context("when x is not a power of two", function () {
      const testSets = [
        [fp(1.125), bn("169925001442312346")],
        [E, bn("1442695040888963394")],
        [PI, bn("1651496129472318782")],
        [bn(1e36), bn("59794705707972522245")],
        [MAX_WHOLE_UD60x18, LOG2_MAX_UD60x18],
        [MAX_UD60x18, LOG2_MAX_UD60x18],
      ];

      forEach(testSets).it("takes %e and returns %e", async function (x: BigNumber, expected: BigNumber) {
        const result: BigNumber = await this.contracts.prbMathUD60x18.doLog2(x);
        expect(expected).to.equal(result);
      });
    });
  });
}
