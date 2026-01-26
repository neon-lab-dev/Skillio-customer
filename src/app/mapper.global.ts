import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

export const globalMapper = createMapper(
    {
        strategyInitializer: classes()
    }
);