import { TFunction } from "i18next";

import * as Types from "@type/types";

const INVALID_PARAMETER: number = 400;
const FILE_NOT_FOUND: number = 404;
const CANNOT_CREATE_FILE: number = 406;
const CANNOT_DELETE_FILE: number = 405;
const ALREADY_EXISTS: number = 407;
const READ_ERROR: number = 500;
const WRITE_ERROR: number = 501;
const EXE_PATH_NOT_FOUND: number = 402;
const TOO_MANY_NODES: number = 503;
const INVALID_OPERATION: number = 504;
const COMMING_SOON: number = 999;

function useTauriExceptionMessage(t: TFunction<"translation", undefined>) {
    const getExceptionMsg = (cmd: Types.TauriCmdEnum, code: number): string => {
        let message = "";
        switch (code) {
            case INVALID_PARAMETER:
                switch(cmd) {
                    case "create_node":
                        message = t("exceptions.create_node.invalid_parameter");
                        break;
                    case "move_node":
                        message = t("exceptions.move_node.invalid_parameter");
                        break;
                    case "rename_node":
                    case "move_node_to_trash":
                    case "get_node_by_id":
                    case "update_node_contents":
                    case "open_in_explorer":
                        message = t("exceptions.get_node_by_id.invalid_parameter");
                        break;
                    default:
                        message = t("exceptions.invalid_parameter");
                }
                break;
            case FILE_NOT_FOUND:
                switch(cmd) {
                    case "get_rconfig":
                    case "get_node_contents":
                        message = t(`exceptions.${cmd}.file_not_found`);
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case CANNOT_CREATE_FILE:
                switch(cmd) {
                    case "get_gconfig":
                    case "set_gconfig":
                        message = t("exceptions.set_gconfig.cannot_create_file");
                        break;
                    case "get_rconfig":
                    case "set_rconfig":
                    case "update_rconfig_node":
                    case "insert_rconfig_node":
                    case "remove_rconfig_node":
                        message = t("exceptions.set_rconfig.cannot_create_file");
                        break;
                    case "create_node":
                        message = t("exceptions.create_node.cannot_create_file");
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case CANNOT_DELETE_FILE:
                switch(cmd) {
                    case "set_gconfig":
                        message = t("exceptions.set_gconfig.cannot_delete_file");
                        break;
                    case "get_rconfig":
                    case "set_rconfig":
                    case "update_rconfig_node":
                    case "insert_rconfig_node":
                    case "remove_rconfig_node":
                        message = t("exceptions.set_rconfig.cannot_delete_file");
                        break;
                    case "move_node_to_trash":
                        message = t("exceptions.move_node_to_trash.cannot_delete_file");
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case ALREADY_EXISTS:
                message = t("exceptions.already_exists");;
                break;
            case READ_ERROR:
                switch(cmd) {
                    case "get_gconfig":
                        message = t("exceptions.get_gconfig.read_error");
                        break;
                    case "get_rconfig":
                        message = t("exceptions.get_rconfig.read_error");
                        break;
                    case "get_node_contents":
                        message = t("exceptions.get_node_contents.read_error");
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case WRITE_ERROR:
                switch(cmd) {
                    case "set_gconfig":
                        message = t("exceptions.set_gconfig.write_error");
                        break;
                    case "set_rconfig":
                    case "update_rconfig_node":
                    case "insert_rconfig_node":
                    case "remove_rconfig_node":
                        message = t("exceptions.set_rconfig.write_error");
                        break;
                    case "update_node_contents":
                        message = t("exceptions.update_node_contents.write_error");
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case EXE_PATH_NOT_FOUND:
                message = t("exceptions.exe_path_not_found");
                break;
            case TOO_MANY_NODES:
                message = t("exceptions.too_many_nodes");
                break;
            case INVALID_OPERATION:
                switch(cmd) {
                    case "move_node":
                        message = t("exceptions.move_node.invalid_operation");
                        break;
                    case "rename_node":
                        message = t("exceptions.rename_node.invalid_operation");
                        break;
                    case "open_in_explorer":
                        message = t("exceptions.open_in_explorer.invalid_operation");
                        break;
                    default:
                        message = t("exceptions.unknown_error");
                }
                break;
            case COMMING_SOON:
                message = t("exceptions.comming_soon");
                break;
            default:
                message = t("exceptions.unknown_error");
        }
        return message;
    };

    return {
        getExceptionMsg,
    };
}

export default useTauriExceptionMessage;