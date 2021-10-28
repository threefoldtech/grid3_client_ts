export const ErrorsMap = {
    // order same as:
    // https://github.com/threefoldtech/tfchain_pallets/blob/f0bb8747d7c70769c77cf814d8f02384b211c88d/pallet-smart-contract/src/lib.rs#L59
    "smartContractModule": [
        "TwinNotExists",
        "NodeNotExists",
        "FarmNotExists",
        "FarmHasNotEnoughPublicIPs",
        "FarmHasNotEnoughPublicIPsFree",
        "FailedToReserveIP",
        "FailedToFreeIPs",
        "ContractNotExists",
        "TwinNotAuthorizedToUpdateContract",
        "TwinNotAuthorizedToCancelContract",
        "NodeNotAuthorizedToDeployContract",
        "NodeNotAuthorizedToComputeReport",
        "PricingPolicyNotExists",
        "ContractIsNotUnique",
        "NameExists",
        "NameNotValid",
    ],
    // order same as:
    // https://github.com/threefoldtech/tfchain_pallets/blob/f0bb8747d7c70769c77cf814d8f02384b211c88d/pallet-tfgrid/src/lib.rs#L129
    "tfgridModule": [
        "NoneValue",
        "StorageOverflow",
        "CannotCreateNode",
        "NodeNotExists",
        "NodeWithTwinIdExists",
        "CannotDeleteNode",
        "NodeDeleteNotAuthorized",
        "NodeUpdateNotAuthorized",
        "FarmExists",
        "FarmNotExists",
        "CannotCreateFarmWrongTwin",
        "CannotUpdateFarmWrongTwin",
        "CannotDeleteFarm",
        "CannotDeleteFarmWrongTwin",
        "IpExists",
        "IpNotExists",
        "EntityWithNameExists",
        "EntityWithPubkeyExists",
        "EntityNotExists",
        "EntitySignatureDoesNotMatch",
        "EntityWithSignatureAlreadyExists",
        "CannotUpdateEntity",
        "CannotDeleteEntity",
        "SignatureLengthIsIncorrect",
        "TwinExists",
        "TwinNotExists",
        "TwinWithPubkeyExists",
        "CannotCreateTwin",
        "UnauthorizedToUpdateTwin",
        "PricingPolicyExists",
        "PricingPolicyNotExists",
        "CertificationCodeExists",
        "FarmingPolicyAlreadyExists",
    ],
}