package com.dsaverse.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateSettingRequest {
    @NotBlank(message = "Setting value cannot be blank")
    private String value;
}
