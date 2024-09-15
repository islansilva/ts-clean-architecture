import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-object/address";

export default class Customer extends Entity {

    private _name: string;
    private _address!: Address;
    private _active: boolean;
    private _rewardPoints: number = 0;



    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this._active = true;
        this.validate();

        if(this.notification.hasError()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }


    validate() {
        CustomerValidatorFactory
        .create()
        .validate(this);
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    set Address(address: Address) {
        this._address = address;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    isActive(): boolean {
        return this._active;
    }


    activate() {
        if(this._address === undefined) {
            throw new Error("Address is required");
        }
        this._active = true;
    }

    desactivate() {
        this._active = false;
    }


}