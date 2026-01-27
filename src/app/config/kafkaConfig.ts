import config from "./index"

export const kafkaConfig={
    brokers: config.kafka_brokers,
    clientId: config.kafka_client_id,
    groupId: config.kafka_group_id
}