export type CountryConfig = {
    name: string;
    code: string;
    flag: string;
    mask: string;
};

export type ConfigType = {
    [key: string]: CountryConfig;
};
