import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListTemplate } from "react-native-carplay";

export default function ListItemTemplate(items: BaseItemDto[] | undefined) : ListTemplate {
    return new ListTemplate({
        sections: [
            {
                items: items?.map(item => {
                    return {
                        id: item.Id!,
                        text: item.Name ?? "Untitled"
                    }
                }) ?? []
            }
        ]
    })
}