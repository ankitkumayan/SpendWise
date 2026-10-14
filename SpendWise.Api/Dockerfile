FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["SpendWise.Api.csproj", "./"]

RUN dotnet restore "SpendWise.Api.csproj"

COPY . .

RUN dotnet publish "SpendWise.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

EXPOSE 5238

ENTRYPOINT ["dotnet", "SpendWise.Api.dll"]