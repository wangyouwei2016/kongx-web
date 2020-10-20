export const pluginOption = {
    // addBtn:false,
    props: {
        img: "img",
        title: "title",
        info: "text"
    }
};
export const pluginGroupOption = {
    column:
        [
            {
                label: "鉴权认证",
                description: "Protect your services with an authentication layer",
                icon: "mdi-account-outline",
                hasConsumerPlugins: false,
                option: {
                    column: [{
                        name: "basic-auth",
                        description: "Add Basic Authentication to your APIs",
                        img: "/img/plugins/basic-auth.png"
                    },
                    {
                        name: "key-auth",
                        description: "Add a key authentication to your APIs"
                        ,
                        img: "/img/plugins/key-auth.png"
                    },
                    {
                        name: "oauth2",
                        description: "Add an OAuth 2.0 authentication to your APIs",
                        img: "/img/plugins/oauth2.png"
                    },
                    {
                        name: "hmac-auth",
                        description: "Add HMAC Authentication to your APIs",
                        img: "/img/plugins/hmac-auth.png"
                    },
                    {
                        name: "jwt",
                        description: "Verify and authenticate JSON Web Tokens",
                        img: "/img/plugins/jwt.png"
                    },
                    {
                        name: "ldap-auth",
                        description: "Integrate Kong with a LDAP server",
                        img: "/img/plugins/ldap-auth.png"
                    }
                    ]
                }
            },
            {
                label: "访问安全",
                icon: "mdi-security",
                hasConsumerPlugins: true,
                description: "Protect your services with additional security layers",
                option: {
                    column: [
                        {
                            name: "acl",
                            hideIfNotInConsumerContext: true,
                            description: "Control which consumers can access APIs",
                            img: "/img/plugins/acl.png"
                        },
                        {
                            name: "cors",
                            hideIfNotInConsumerContext: true,
                            description: "Allow developers to make requests from the browser",
                            img: "/img/plugins/cors.png"
                        },
                        {
                            name: "ip-restriction",
                            description: "Whitelist or blacklist IPs that can make requests",
                            img: "/img/plugins/ip-restriction.png"
                        },
                        {
                            name: "bot-detection",
                            hideIfNotInConsumerContext: true,
                            description: "Detects and blocks bots or custom clients",
                            img: "/img/plugins/bot-detection.png"
                        }
                    ]
                }
            },
            {
                label: "请求控制",
                icon: "mdi-traffic-light",
                hasConsumerPlugins: true,
                description: "Manage, throttle and restrict inbound and outbound API traffic",
                option: {
                    column: [
                        {
                            name: "rate-limiting",
                            description: "Rate-limit how many HTTP requests a developer can make",
                            img: "/img/plugins/rate-limiting.png"
                        },
                        {
                            name: "response-ratelimiting",
                            description: "Rate-Limiting based on a custom response header value",
                            img: "/img/plugins/response-ratelimiting.png"
                        },
                        {
                            name: "request-size-limiting",
                            description: "Block requests with bodies greater than a specific size",
                            img: "/img/plugins/request-size-limiting.png"
                        },
                        {
                            name: "request-termination",
                            description: "This plugin terminates incoming requests with a specified status code and message. This allows to (temporarily) block an API or Consumer.",
                            img: "/img/plugins/request-termination.png"
                        },
                    ]
                }
            },
            {
                label: "Serverless",
                description: "Invoke serverless functions in combination with other plugins:",
                icon: "mdi-cloud-sync",
                hasConsumerPlugins: true,
                option: {
                    column: [
                        {
                            name: "aws-lambda",
                            description: "Invoke an AWS Lambda function from Kong. It can be used in combination with other request plugins to secure, manage or extend the function.",
                            img: "/img/plugins/aws-lambda.png"
                        },
                        {
                            name: "pre-function",
                            hideIfNotInConsumerContext: true,
                            description: "Dynamically run Lua code from Kong during access phase.",
                            img: "/img/plugins/kong.svg"
                        },
                        {
                            name: "post-function",
                            hideIfNotInConsumerContext: true,
                            description: "Dynamically run Lua code from Kong during access phase.",
                            img: "/img/plugins/kong.svg"
                        },
                        {
                            name: "azure-functions",
                            description: "This plugin invokes Azure Functions. It can be used in combination with other request plugins to secure, manage or extend the function",
                            img: "/img/plugins/azure-functions.png"
                        }
                    ]
                }
            },
            {
                label: "分析监控",
                hasConsumerPlugins: true,
                icon: "mdi-chart-bar",
                description: "Visualize, inspect and monitor APIs and microservices traffic",
                option: {
                    column: [
                        {
                            name: "galileo",
                            description: "Business Intelligence Platform for APIs",
                            img: "/img/plugins/galileo.png"
                        },
                        {
                            name: "datadog",
                            description: "Visualize API metrics on Datadog",
                            img: "/img/plugins/datadog.png"
                        },
                        {
                            name: "runscope",
                            description: "API Performance Testing and Monitoring",
                            img: "/img/plugins/runscope.png"
                        },
                        {
                            name: "prometheus",
                            description: "Expose metrics related to Kong and proxied upstream services in Prometheus exposition format",
                            img: "/img/plugins/prometheus.png"
                        },
                        {
                            name: "zipkin",
                            description: "Propagate Zipkin distributed tracing spans, and report spans to a Zipkin server.",
                            img: "/img/plugins/zipkin.png"
                        },

                    ]
                }
            },
            {
                label: "处理转换",
                hasConsumerPlugins: true,
                icon: "mdi-nfc-tap",
                description: "Transform request and responses on the fly on Kong",
                option: {
                    column: [{
                        name:
                            "request-transformer",
                        description: "Modify the request before hitting the upstream server",
                        img: "/img/plugins/request-transformer.png"
                    },
                    {
                        name: "response-transformer",
                        description: "Modify the upstream response before returning it to the client",
                        img: "/img/plugins/response-transformer.png"
                    },
                    {
                        name: "correlation-id",
                        description: "Correlate requests and responses using a unique ID",
                        img: "/img/plugins/correlation-id.png"
                    },
                    ]
                }
            },
            {
                label: "访问日志",
                hasConsumerPlugins: true,
                icon: "mdi-content-paste",
                description: "Log requests and response data using the best transport for your infrastructure",
                option: {
                    column: [
                        {
                            name: "tcp-log",
                            description: "Send request and response logs to a TCP server",
                            img: "/img/plugins/tcp-log.png"
                        },
                        {
                            name: "udp-log",
                            description: "Send request and response logs to an UDP server",
                            img: "/img/plugins/udp-log.png"
                        },
                        {
                            name: "http-log",
                            description: "Send request and response logs to an HTTP server",
                            img: "/img/plugins/http-log.png"
                        },
                        {
                            name: "file-log",
                            description: "Append request and response data to a log file on disk",
                            img: "/img/plugins/file-log.png"
                        },
                        {
                            name: "syslog",
                            description: "Send request and response logs to Syslog",
                            img: "/img/plugins/syslog.png"
                        },
                        {
                            name: "statsd",
                            description: "Send request and response logs to StatsD",
                            img: "/img/plugins/statsd.png"
                        },
                        {
                            name: "loggly",
                            description: "Send request and response logs to Loggly",
                            img: "/img/plugins/loggly.png"
                        },

                    ]
                }
            }
        ]
};