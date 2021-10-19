#include<stdio.h>
int main(void){
    char str[100];
    printf("Program started\n");
    printf("Enter text: ");
    scanf("%s", str);
    printf("User input: %s", str);
    printf("Program exited\n");
    return 0;
}