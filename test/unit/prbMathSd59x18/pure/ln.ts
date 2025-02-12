import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import forEach from "mocha-each";

import { E, LN_E, LN_MAX_SD59x18, MAX_SD59x18, MAX_WHOLE_SD59x18, PI, ZERO } from "../../../../helpers/constants";
import { bn, fp } from "../../../../helpers/numbers";

export default function shouldBehaveLikeLn(): void {
  context("when x is zero", function () {
    it("reverts", async function () {
      const x: BigNumber = ZERO;
      await expect(this.contracts.prbMathSD59x18.doLn(x)).to.be.reverted;
    });
  });

  context("when x is negative", function () {
    it("reverts", async function () {
      const x: BigNumber = fp(-0.1);
      await expect(this.contracts.prbMathSD59x18.doLn(x)).to.be.reverted;
    });
  });

  context("when x is positive", function () {
    const testSets = [
      [fp(0.1), bn("-2302585092994045674")],
      [fp(0.2), bn("-1609437912434100365")],
      [fp(0.3), bn("-1203972804325935984")],
      [fp(0.4), bn("-916290731874155055")],
      [fp(0.5), bn("-693147180559945309")],
      [fp(0.6), bn("-510825623765990674")],
      [fp(0.7), bn("-356674943938732371")],
      [fp(0.8), bn("-223143551314209746")],
      [fp(0.9), bn("-105360515657826292")],
      [fp(1), ZERO],
      [fp(1.125), bn("117783035656383442")],
      [fp(2), bn("693147180559945309")],
      [E, LN_E],
      [PI, bn("1144729885849400163")],
      [fp(4), bn("1386294361119890619")],
      [fp(8), bn("2079441541679835928")],
      [bn(1e36), bn("41446531673892822311")],
      [MAX_WHOLE_SD59x18, LN_MAX_SD59x18],
      [MAX_SD59x18, LN_MAX_SD59x18],
    ];

    forEach(testSets).it("takes %e and returns %e", async function (x: BigNumber, expected: BigNumber) {
      const result: BigNumber = await this.contracts.prbMathSD59x18.doLn(x);
      expect(expected).to.equal(result);
    });
  });
}
