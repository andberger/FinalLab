#include <stdio.h>
#include <string.h>


int authenticate(char a[], char b[])
{
	int i = 0;
	while (a[i] == b[i]) {
		if (a[i] == '\0' || b[i] == '\0')
			break;
		i++;
	}
	
	if (a[i] == '\0' && b[i] == '\0')
		return 0;
	else
		return -1;
}

int main(int argc, char** argv)
{
	char pw[16];
	int authenticated = 0;
	strcpy(pw, argv[1]);

	if(authenticate(pw, "adminpasswabcdef") < 0)
	{
		printf("\nUser authentication failed. Please try again.\n");
	}
	else
	{
		printf("\nAuthentication successful! \n");
		authenticated = 1;
	}

	if(authenticated)
	{
		printf("\n**********You are viewing sensitive information*************\n");
	}

	return 0;
}
