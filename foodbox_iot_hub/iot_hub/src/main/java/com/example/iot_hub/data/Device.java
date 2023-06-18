package com.example.iot_hub.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
public class Device {
    private @Getter @Setter int dev_id;
    private @Getter @Setter char battery;
    private @Getter @Setter char alloc;
    private @Getter @Setter char lock;
    private @Getter @Setter double latitude;
    private @Getter @Setter double longitude;
}
