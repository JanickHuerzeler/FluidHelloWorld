import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";

export interface ICoinFlipper extends EventEmitter {
    readonly value: number;

    flip: () => void;

    on(event: 'coinFlipped', listener: () => void): this;
}

const coinValueKey = "coinValue";

export class CoinFlipper extends DataObject implements ICoinFlipper {

    protected async initializingFirstTime() {
        this.root.set(coinValueKey, 0);
    }
    protected async hasInitialized() {
        this.root.on('valueChanged', (changed: IValueChanged) => {
            if (changed.key === coinValueKey) {
                this.emit('coinFlipped');
            }
        });
    }

    public get value() {
        return this.root.get(coinValueKey);
    }

    public readonly flip = () => {
        const flipValue = Math.round(Math.random());
        console.log(`flipValue: ${flipValue}`);
        this.root.set(coinValueKey, flipValue);
    }
}

export const CoinFlipperInstantiationFactory = new DataObjectFactory(
    "coin-flipper",
    CoinFlipper,
    [],
    {},
);