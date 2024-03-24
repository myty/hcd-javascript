import "jest-extended/all";
import "@testing-library/jest-dom";
import { Factory } from "rosie";
import React from "react";
import { initializeFactories } from "./tests/factories";

global.React = React; // this also works for other globally available libraries

beforeAll(() => {
    initializeFactories({
        define: (name, constructor) => Factory.define(name, constructor),
    });
});

// Run before each individual test across the entire test suite
beforeEach(() => {
    jest.resetAllMocks();
});
